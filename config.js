module.exports = {
	svnDirectories: 'config docroot local templates vendor',
	localDirectories: '',
	site: 'rsahr.imarc.net',
	environments: {
		dev: {
			postgresDB: 'dev_hr_rsa_com',
			postgresSourceDB: 'dev_hr_rsa_com'
		},
		stage: {
			postgresDB: 'stage_hr_rsa_com',
			postgresSourceDB: 'dev_hr_rsa_com'
		},
		prod: {
			postgresDB: 'hr_rsa_com',
			postgresSourceDB: 'dev_hr_rsa_com'
		}
	},
	hosts: {
		cask: {
			sshHost: 'root@cask.imarc.net'
		}
	}
};
