export const createElement = (parent: Element = undefined, type: string = "div", innerHTML: string = undefined, className: string = undefined, id: string = undefined) => {
    if (!parent)
        return;

    var element = document.createElement(type);
    //Assign different attributes to the element.
    if (innerHTML && innerHTML.length > 0)
        element.innerHTML = innerHTML;

    if (id && id.length > 0)
        element.setAttribute('id', id);

    if (className && className.length > 0)
        element.className = className;

    parent.appendChild(element);

    return element;
}
