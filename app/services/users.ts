
export async function fetchVerificationCodes(phoneNumber: string) {
    const res = await fetch(`/api/v0/verification-codes`,{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
    });
    const data = await res.json();
    return data;
}