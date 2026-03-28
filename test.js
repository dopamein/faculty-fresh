fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "password123" })
}).then(async res => {
  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("BODY:", text);
}).catch(console.error);
