var app = {
    doms: {
        doctors: null,
        domainBtns: null,
        highlight: null
    },
    params: {
        doctorsClassNameOrg: null,
        domainHeight: 32,
        selectedDomain: 0
    },
    bindSelectDomain: function () {
        var i;
        var bindSelectBtnEvent = function (item, index) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                selectDomain(index, e.target.getAttribute('href'));
            });
        };
        var filterDomain = function (category) {
            var doctors = app.doms.doctors;
            var i;
            var j;
            var found;

            if (category === 'all') {
                for (i = 0; i < doctors.length; i += 1) {
                    doctors[i].className = app.params.doctorsClassNameOrg;
                }
            } else {
                // predefined peopleCategory
                for (i = 0; i < peopleCategory.length; i += 1) {
                    found = false;
                    for (j = 0; j < peopleCategory[i].domains.length; j += 1) {
                        if (peopleCategory[i].domains[j] === category) {
                            found = true;
                        }
                    }
                    if (found) {
                        doctors[i].className = doctors[i].className = app.params.doctorsClassNameOrg;
                    } else {
                        doctors[i].className = app.params.doctorsClassNameOrg + ' hide';
                    }
                }
            }
        };
        var selectDomain = function (index, anchor) {
            var i;
            var domainName = app.doms.domainBtns[index].innerText;
            var domainBtns = app.doms.domainBtns;

            if (app.params.selectedDomain !== index) {
                app.params.selectedDomain = index;
                for (i = 0; i < domainBtns.length; i += 1) {
                    domainBtns[i].className = domainBtns[i].className.replace(' selected', '');
                }
                domainBtns[index].className += ' selected';
                app.doms.highlight.style.top = app.params.domainHeight * index + 'px';
                if (index === 0) {
                    filterDomain('all');
                } else {
                    filterDomain(domainName);
                }
                window.history.pushState({}, document.title, app.params.baseUrl + anchor);
            }
        };
        var selectOnLoad = function () {
            var url = window.location.href;
            var anchorIndex = url.indexOf('#division-');
            var anchor;
            var domainIndex;

            app.params.baseUrl = url.substring(0, anchorIndex);
            if (anchorIndex > 0) {
                anchor = url.substring(url.indexOf('#'));
                domainIndex =  parseInt(anchor.substring(anchor.indexOf('-') + 1)) - 1;
                selectDomain(domainIndex);
            }
        };

        for (i = 0; i < app.doms.domainBtns.length; i += 1) {
            bindSelectBtnEvent(app.doms.domainBtns[i], i);
        }
        selectOnLoad();
    },
    bindSubpage: function () {
        var i;
        var bindSelectSubpageEvent = function (item, index) {
            item.addEventListener('click', function (e) {
                var href = e.target.getAttribute('href');
                var subpageName = href.substring(href.indexOf('#') + 1);
                e.preventDefault();
                selectSubpage(subpageName, index);
            });
        };
        var selectSubpage = function (className, index) {
            var i;

            for (i = 0; i < app.doms.subpages.length; i += 1) {
                if (app.doms.subpages[i].className.indexOf(className) > 0) {
                    app.doms.subpages[i].style.display = 'block';
                } else {
                    app.doms.subpages[i].style.display = null;
                }
            }
            for (i = 0; i < app.doms.subnavs.length; i += 1) {
                if (i === index) {
                    app.doms.subnavs[i].className = 'selected';
                    app.doms.sidebars[i].className = 'selected';

                } else {
                    app.doms.subnavs[i].className = '';
                    app.doms.sidebars[i].className = '';
                }
            }
            window.history.pushState({}, document.title, app.params.baseUrl + '#' + className);
        };
        var selectOnLoad = function () {
            var url = window.location.href;
            var anchorIndex = url.indexOf('#');
            var anchorName;
            var i;
            var selectedSubpage;
            var selectedSubpageIndex;
            var firstItemClassNames;

            app.params.baseUrl = url.substring(0, anchorIndex);
            if (anchorIndex > 0) {
                anchorName = url.substring(url.indexOf('#') + 1);
                for (i = 0; i < app.doms.subpages.length; i += 1) {
                    if (app.doms.subpages[i].className.indexOf(anchorName) > 0) {
                        selectedSubpage = anchorName;
                        selectedSubpageIndex = i;
                    }
                }
            }
            // invalid anchor, redirect to basepage
            if (!selectedSubpage) {
                firstItemClassNames = app.doms.subpages[0].className.split(' ');
                selectedSubpage = firstItemClassNames[firstItemClassNames.length - 1];
                selectedSubpageIndex = 0;
                window.history.pushState({}, document.title, app.params.baseUrl);
            }
            selectSubpage(selectedSubpage, selectedSubpageIndex);
        };

        for (i = 0; i < app.doms.subnavs.length; i += 1) {
            bindSelectSubpageEvent(app.doms.subnavs[i], i);
            bindSelectSubpageEvent(app.doms.sidebars[i], i);
        }
        selectOnLoad();
    },
    bindMapToggle: function () {
        var toggleMap = function (target, className) {
            if (target.className.indexOf(className) < 0) {
                target.className = className;
            } else {
                target.className = '';
            }
        };
        var mapLink = document.getElementsByClassName('mapLink');
        var infoMobile = document.getElementsByClassName('info-mobile');
        var mapCloseBtn = document.querySelector('.mapOverlay .overlay-close');

        mapLink[0].addEventListener('click', function () {
            toggleMap(document.body, 'overlay');
        });
        infoMobile[0].addEventListener('click', function (e) {
            e.preventDefault();
            toggleMap(document.body, 'overlay');
        });
        mapCloseBtn.addEventListener('click', function () {
            toggleMap(document.body, 'overlay');
        });
    },
    appendCSS: function (filePath) {
        var style = document.createElement('link');
        var head = document.getElementsByTagName('head')[0];

        style.rel = 'stylesheet';
        style.href = filePath;
        head.appendChild(style);
    },
    init: function () {
        // Apply critical path only in home page
        /*
        var pageClass = document.getElementsByClassName('page')[0];
        if (pageClass.className.indexOf('index') > 0) {
            appendCSS('./production.css');
        }
        */
        app.appendCSS('./production.css');
        app.bindMapToggle();
        app.doms.domainBtns = document.getElementsByClassName('select-domain');
        if (app.doms.domainBtns.length > 0) {
            app.doms.domainBtns[app.params.selectedDomain].className += ' selected';
            app.doms.highlight = document.getElementsByClassName('highlight')[0];
            app.doms.doctors = document.getElementsByClassName('people-doc');
            app.doms.highlight.style.top = 0;
            app.params.doctorsClassNameOrg = app.doms.doctors[0].className;
            app.bindSelectDomain();
        }
        app.doms.subpages = document.getElementsByClassName('subpage');
        if (app.doms.subpages.length > 0) {
            app.doms.subnavs = document.querySelectorAll('.subnav li a');
            app.doms.sidebars = document.querySelectorAll('.service-subs li a');
            app.bindSubpage();
            //subpage
        }
    }
};

app.init();