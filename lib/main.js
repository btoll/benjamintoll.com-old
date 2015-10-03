window.onload = function () {
    var menu = document.querySelector('#menu'),
        list = menu.querySelector('ul'),
        link = document.querySelector('#hamburger'),
        div = document.createElement('div'),
        style = div.style,
        body = document.body,
        currentHeight = 0,
        listHeight;

    function animate(closing) {
        if (!closing) {
            menu.style.display = 'block';
            link.style.color = '#fff';

            if (currentHeight < listHeight) {
                currentHeight += 10;
                list.style.height = currentHeight + 'px';

                setTimeout(function () {
                    animate(false);
                }, 5);
            }

        } else {
            if (currentHeight > 10) {
                currentHeight -= 10;
                list.style.height = currentHeight + 'px';

                setTimeout(function () {
                    animate(true);
                }, 5);
            } else {
                menu.style.display = 'none';
                link.style.color = '#000';
            }
        }
    }

    // Position the new div safely outside of the viewport.
    style.display = 'block';
    style.position = 'absolute';
    style.top = '-10000px';

    // Append the element to be measured.
    div.appendChild(list);

    // The new div must be in the DOM in order for it or any hierarchical elements to be measured.
    body.appendChild(div);

    // Measure, re-append, and cleanup.
    listHeight = list.scrollHeight;
    list.style.height = 0;
    menu.appendChild(list);
    body.removeChild(div);
    div = null;

    link.addEventListener('click', function (e) {
        animate(menu.style.display === 'block');
        e.preventDefault();
    });
};

