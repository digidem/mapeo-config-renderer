module.exports = function (...log) {
    if (process.env.DEBUG) console.log('*DEBUG - ', ...log)
}