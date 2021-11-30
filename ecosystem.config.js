module.exports = {
  apps : [{
    name   : "walktogather",
    script : "./node_modules/.bin/ts-node",
	args : "./src/index.ts",
	  watch : true
  }]
}
