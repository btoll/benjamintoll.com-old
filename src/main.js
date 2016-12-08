window.onload = function () {
    var menu = document.querySelector('#menu'),
        list = menu.querySelector('ul'),
        link = document.querySelector('a.hamburger'),
        placeholder = document.querySelector('span.hamburger'),
        div = document.createElement('div'),
        style = div.style,
        body = document.body,
        currentHeight = 0,
        listHeight;

    function animate(closing) {
        if (!closing) {
            menu.style.display = 'block';

            // Hide the link so it cannot be continued to clicked which would put the animation
            // into an untenable state.
            // Note the <span> is positioned directly behind it with the same styling.
            link.style.display = 'none';

            if (currentHeight < listHeight) {
                currentHeight += 10;
                list.style.height = currentHeight + 'px';

                setTimeout(function () {
                    animate(false);
                }, 5);
            } else {
                // Show the link with the proper color once the animation has completed.
                link.style.display = 'block';
                link.style.color = '#fff';
                placeholder.style.color = '#fff';
            }
        } else {
            if (currentHeight > 10) {
                currentHeight -= 10;
                list.style.height = currentHeight + 'px';

                // Hide the link while we're animating.
                link.style.display = 'none';

                setTimeout(function () {
                    animate(true);
                }, 5);
            } else {
                // Once the animation has completed, reset everything to its original state.
                menu.style.display = 'none';
                link.style.display = 'block';
                link.style.color = '#000';
                placeholder.style.color = '#000';
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

    // Measure, re-append, hide the menu, show the hamburger span and link, and cleanup.
    listHeight = list.scrollHeight;
    list.style.height = 0;
    menu.appendChild(list);
    menu.style.display = 'none';
    placeholder.style.display = link.style.display = 'block';
    body.removeChild(div);
    div = null;

    link.addEventListener('click', function (e) {
        animate(menu.style.display === 'block');
        e.preventDefault();
    });
};

