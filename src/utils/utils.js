function $(selector) {
    const eles = document.querySelectorAll(selector);
    return eles.length > 1 ? eles : document.querySelector(selector);
}

module.exports = {
    $,
}