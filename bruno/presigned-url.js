function savePresignEnv(res) {
	const b = res.body;

	bru.setEnvVar("UPLOAD_URL", b.url);

	Object.entries(b.fields).forEach(([k, v]) => {
		const name = k.replace(/[^A-Za-z0-9_]/g, "_").toUpperCase();
		bru.setEnvVar(name, String(v));
	});
}

module.exports = { savePresignEnv };
