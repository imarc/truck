module.exports = {
	site: 'rsahr.imarc.net',
	environments: {
		dev: {
			postgresDB: 'dev_hr_rsa_com'
		},
		stage: {
			postgresDB: 'stage_hr_rsa_com'
		},
		prod: {
			postgresDB: 'hr_rsa_com',
		}
	},
	hosts: {
		cask: {
			sshHost: 'web@cask.imarc.net'
		}
	}
};
