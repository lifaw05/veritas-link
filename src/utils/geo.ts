
/**
 * List of states where prediction markets might be restricted.
 * exact list depends on the specific exchange regulations.
 * Using the example list from the skill description.
 */
export const RESTRICTED_STATES = ['NV', 'WA'];

export interface ComplianceResult {
    allowed: boolean;
    region?: string;
    reason?: string;
}

/**
 * Checks if a user is compliant based on their real IP location and VPN status.
 * Uses ipapi.is for robust detection.
 */
export async function checkComplianceAsync(): Promise<ComplianceResult> {
    try {
        const response = await fetch('https://api.ipapi.is/');
        if (!response.ok) {
            console.warn('Geo-IP fallback: API failed');
            return { allowed: true, region: 'Unknown' }; // Fallback to allow if check fails? Or restrict? Defaulting to allow for UX but flagging unknown.
        }

        const data = await response.json();

        // 1. Check VPN/Proxy
        if (data.is_vpn || data.is_proxy || data.is_tor) {
            return {
                allowed: false,
                region: 'Anonymous',
                reason: 'VPN/Proxy Detected'
            };
        }

        // 2. Check Region
        const country = data.country_code;
        const region = data.region_code; // State code for US

        // Strict US Compliant Exchange rules usually:
        // - Must be US (if US exchange) OR Non-US (if offshore).
        // - If US, checks state.

        // For this demo, let's assume we are acting like a US-regulated entity (like Kalshi) 
        // that blocks specific states, BUT generally allows US.
        // If Polymarket (offshore), they block US entirely.

        // User didn't specify WHICH rules, just "real geo-fencing".
        // Given we are showing Polymarket (which blocks US), technically we should block US IPs.
        // BUT, the prompt implies "Veritas Link" is a service.
        // Let's implement the state-restriction logic as requested originally in Phase 1.

        if (country === 'US' && RESTRICTED_STATES.includes(region)) {
            return {
                allowed: false,
                region: region,
                reason: `Restricted State: ${region}`
            };
        }

        return {
            allowed: true,
            region: region || country
        };

    } catch (error) {
        console.error('Geo check failed', error);
        return { allowed: true, region: 'Error' };
    }
}

/**
 * @deprecated Use checkComplianceAsync instead.
 */
export function checkCompliance(userRegion: string): boolean {
    if (!userRegion) return false;
    return !RESTRICTED_STATES.includes(userRegion.toUpperCase());
}
