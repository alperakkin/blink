
const importAll = (r) => {
    let icons = {};
    r.keys().forEach((key) => {
        const iconName = key.replace('./', '').replace('.svg', '');
        icons[iconName] = r(key);
    });
    return icons;
};
let fileIcons = importAll(require.context("../public/icons/extensions", false, /\.svg$/));
let defaults = {

    "defaultFile": "📄",
    "defaultFolder": "🗂️"
};
fileIcons = {
    ...fileIcons, ...defaults

};

export default fileIcons;