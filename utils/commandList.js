module.exports = {
    /**
     * @description Creates a command field array for a discord embed with the given <Object> commands
     * @argument commands
     */
    create: function(commands) {
        try {
            if (!commands) return []
            let list = []
            Object.keys(commands).forEach(category => {
                let object = {
                    name: category,
                    value: ""
                }
                commands[category].forEach(cmd => {
                    object.value = object.value + "`" + `${cmd}` + "`" + `${commands[category].indexOf(cmd) == (commands[category].length - 1) ? "" : ","}` + " "
                })
                list.push(object)
            })
            return list
        } catch (e) { console.error(e) }
    }
}