/**
 * Deploy AdSense traffic-cleaning WAF rules for identityinsight.org
 *
 * Usage:
 *   set CLOUDFLARE_API_TOKEN=your_token_with_zone_waf_edit
 *   node scripts/deploy-waf-traffic-rules.mjs
 *
 * Required API token permissions:
 *   - Zone > WAF > Edit
 *   - Zone > Zone > Read
 */

const ZONE_NAME = 'identityinsight.org';
const ACCOUNT_ID = '892acd09257ee1251aca55e5a6f9946e';

const RULES = [
  {
    description: 'AdSense Rule 1: Block datacenter/cloud hosting ASNs',
    action: 'block',
    expression:
      '(ip.src.asnum in {16509 14618 15169 396982 8075 8068 8069 14061 16276 24940 20473 63949 31898 12876 45102 37963 132203 45090 20940 54600 47583 51167 62240 46606 36351 35916 36352 60781 29802 60068 51177 9009 2635 14117 4134}) and not cf.client.bot',
  },
  {
    description: 'AdSense Rule 2: Challenge anonymizers and open proxies',
    action: 'managed_challenge',
    expressionEnterprise:
      '(ip.src in $cf.anonymizer or ip.src in $cf.open_proxies) and not cf.client.bot',
    expressionFallback:
      '(cf.threat_score gt 10 and not cf.client.bot)',
  },
  {
    description: 'AdSense Rule 3: Challenge non-mobile user agents',
    action: 'managed_challenge',
    expression:
      '(not (http.user_agent contains "Mobile" or http.user_agent contains "Android" or http.user_agent contains "iPhone") and not cf.client.bot)',
  },
];

const API = 'https://api.cloudflare.com/client/v4';

function getToken() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    throw new Error(
      'Missing CLOUDFLARE_API_TOKEN. Create a token with Zone > WAF > Edit permission at https://dash.cloudflare.com/profile/api-tokens'
    );
  }
  return token;
}

async function cf(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!data.success) {
    const msg = data.errors?.map((e) => e.message).join('; ') || res.statusText;
    throw new Error(`${options.method || 'GET'} ${path} failed: ${msg}`);
  }
  return data.result;
}

async function getZone() {
  const zones = await cf(`/zones?name=${ZONE_NAME}`);
  if (!zones.length) throw new Error(`Zone not found: ${ZONE_NAME}`);
  return zones[0];
}

function isEnterprise(planName) {
  return /enterprise/i.test(planName || '');
}

async function getOrCreateCustomRuleset(zoneId) {
  try {
    return await cf(`/zones/${zoneId}/rulesets/phases/http_request_firewall_custom/entrypoint`);
  } catch (err) {
    if (!/404|not found/i.test(String(err.message))) throw err;
    return cf(`/zones/${zoneId}/rulesets`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Custom WAF rules',
        kind: 'zone',
        phase: 'http_request_firewall_custom',
        rules: [],
      }),
    });
  }
}

function buildRules(planName) {
  const enterprise = isEnterprise(planName);
  return RULES.map((rule) => {
    let expression = rule.expression;
    if (rule.expressionEnterprise) {
      expression = enterprise ? rule.expressionEnterprise : rule.expressionFallback;
    }
    return {
      description: rule.description,
      expression,
      action: rule.action,
      enabled: true,
      _enterprise: enterprise,
      _usedFallback: Boolean(rule.expressionEnterprise && !enterprise),
    };
  });
}

async function upsertRule(zoneId, rulesetId, ruleDef, existingRules) {
  const payload = {
    description: ruleDef.description,
    expression: ruleDef.expression,
    action: ruleDef.action,
    enabled: true,
  };

  const existing = existingRules.find((r) => r.description === ruleDef.description);
  if (existing) {
    const updated = await cf(`/zones/${zoneId}/rulesets/${rulesetId}/rules/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return { mode: 'updated', rule: updated };
  }

  const created = await cf(`/zones/${zoneId}/rulesets/${rulesetId}/rules`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return { mode: 'created', rule: created };
}

async function main() {
  const zone = await getZone();
  console.log(`Zone: ${zone.name} (${zone.id})`);
  console.log(`Plan: ${zone.plan?.name || 'unknown'}`);

  const ruleDefs = buildRules(zone.plan?.name);
  const ruleset = await getOrCreateCustomRuleset(zone.id);
  const existingRules = ruleset.rules || [];

  for (const ruleDef of ruleDefs) {
    const { mode, rule } = await upsertRule(zone.id, ruleset.id, ruleDef, existingRules);
    const tag = ruleDef._usedFallback ? ' [Free-plan fallback]' : '';
    console.log(`${mode.toUpperCase()}: ${ruleDef.description}${tag}`);
    console.log(`  action=${rule.action}`);
    console.log(`  expression=${rule.expression}`);
  }

  if (!isEnterprise(zone.plan?.name)) {
    console.log('\nNote: Free/Pro/Business plan detected.');
    console.log('- Rule 1 uses inline cloud ASN list (Block).');
    console.log('- Rule 2 uses cf.threat_score fallback (Enterprise Managed IP Lists unavailable).');
    console.log('- Upgrade to Enterprise to use cf.anonymizer and cf.open_proxies lists.');
  }

  console.log('\nDone. Verify at: https://dash.cloudflare.com → Security → WAF → Custom rules');
}

main().catch((err) => {
  console.error(`\nDeploy failed: ${err.message}`);
  process.exit(1);
});
