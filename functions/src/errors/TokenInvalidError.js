class TokenInvalidError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TokenInvalidError';
    }
}

module.exports = { TokenInvalidError };