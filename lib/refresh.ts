const refresh = async() => {
try{
    if (!localStorage.getItem('refreshToken')) return false;

    const new_token = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
},
body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken'), accessToken: localStorage.getItem('accessToken') })
});
if (!new_token.ok) {
    return false;
}
const access = await new_token.json();
localStorage.setItem('accessToken', access.token);
return true;
}
catch (error) {
    return false
}
}
export default refresh;