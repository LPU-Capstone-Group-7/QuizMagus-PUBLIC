export const sendOTP = async (data : any) => fetch('/api/smtp',{
    method : "POST",
    body :  JSON.stringify(data),
    headers : {
        'Content-Type': 'application/json'
    },
})