import bcrypt from "bcryptjs";
const hashContent = async function (content) {
    const hashedContent = await bcrypt.hash(content, 12);
    return hashedContent;
};
const compareHash = async function (content, hash) {
    const isMatch = await bcrypt.compare(content, hash);
    return isMatch;
};
export { hashContent, compareHash };
//# sourceMappingURL=bcrypt.js.map