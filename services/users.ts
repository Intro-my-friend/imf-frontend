export async function fetchVerificationCodes(phoneNumber: string, token:string) {
    return fetch(`http://15.164.39.230:8000/api/v0/users/verification-codes`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber })})
}

export async function fetchVerification(phoneNumber: string,verificationNumber: string, token:string) {
    return fetch(`http://15.164.39.230:8000/api/v0/users/verification`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber,verificationNumber })})
}