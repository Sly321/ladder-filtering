// ==UserScript==
// @name         WoW Ladder Site Filtering
// @namespace    https://github.com/Sly321/ladder-filtering
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        https://worldofwarcraft.com/de-de/game/pvp/leaderboards/*
// @grant        none
// @updateURL	 https://raw.githubusercontent.com/Sly321/ladder-filtering/master/wow-ladder-filter.user.js
// ==/UserScript==

(function() {
    'use strict';

    const wowClasses = {
        deathknight: {
            unholy: "Unheilig",
            blood: "Blut",
            frost: "Frost"
        },
        demonhunter: {
            havoc: "Rachsucht",
            anderer: "Verwüstung"
        },
        druid: {
            restoration: "Wiederherstellung",
            guardian: "Wächter",
            moonkin: "Gleichgewicht",
            feral: "Wildheit"
        },
        hunter: {
            survival: "Überleben",
            beastmaster: "Tierherschafft"
        },
        mage: {
            fire: "Feuer",
            frost: "Frost",
            arcane: "Arkan"
        },
        monk: {
            windwalker: "Windläufer",
            mistweaver: "Nebelwirker",
            brewmaster: "Braumeister"
        },
        paladin: {
            holy: "Heilig",
            dps: "Vergeltung"
        },
        priest: {
            discipline: "Disziplin",
            holy: "Heilig",
            shadow: "Schatten",
        },
        rogue: {
            assassination: "Meucheln",
            insert: "Täuschung"
        },
        shaman: {
            elemental: "Elementar",
            restoration: "Wiederherstellung"
        },
        warlock: {
            destruction: "Zerstörung",
            afflication: "Gebrechen",
            demonology: "Dämonologie"
        },
        warrior: {
            arms: "Waffen",
            fury: "Furor",
            tank: "Schutz"
        },
    }

    let filter = []

    function toggleFilter(wowClass) {
        const index = filter.indexOf(wowClass)

        if (index >= 0) {
            filter.splice(index, 1)
            document.querySelector(`#wow-ladder-filter--${wowClass.toUpperCase()} .GameIcon-icon`).style = "opacity: 0.3;"
            document.querySelector(`#wow-ladder-filter--${wowClass.toUpperCase()} .GameIcon-borderImage`).style = "display: none;"
        } else {
            filter.push(wowClass)
            document.querySelector(`#wow-ladder-filter--${wowClass.toUpperCase()} .GameIcon-icon`).style = ""
            document.querySelector(`#wow-ladder-filter--${wowClass.toUpperCase()} .GameIcon-borderImage`).style = ""
        }

        resetCSS()
        doFilter()
    }

    function createGameIcon(wowClass, active = false) {
        const container = document.createElement("div")
        container.id = `wow-ladder-filter--${wowClass.toUpperCase()}`
        container.classList.add("GameIcon", `GameIcon--${wowClass.toUpperCase()}`, "GameIcon--medium", "GameIcon--bordered", "GameIcon--rounded", "margin-top-xSmall")

        container.addEventListener("click", toggleFilter.bind(this, wowClass))

        const gameIcon = document.createElement("div")
        gameIcon.classList.add("GameIcon-icon")

        const borderImage = document.createElement("div")
        borderImage.classList.add("GameIcon-borderImage")

        if (!active) {
            gameIcon.style = "opacity: 0.3;"
            borderImage.style = "display: none;"
        }

        container.appendChild(gameIcon)
        container.appendChild(borderImage)

        return container
    }

    function doFilter() {
        const specs = filter.flatMap(wowClass => Object.keys(wowClasses[wowClass]).map(spec => wowClasses[wowClass][spec]))
        console.log(specs)

        if (filter.length === 0) {

        } else {
            Array.prototype.slice.call(document.querySelectorAll(".Paginator .SortTable-row"), 1).forEach(row => {
                const spec = row.querySelector(".Character-level").innerHTML

                const shouldHide = specs.every(someSpec => {
                    const res = spec.indexOf(someSpec) === -1
                    console.log("spec: ", spec, "some: ", someSpec, res)
                    return res
                })

                if (shouldHide) {
                    row.classList.add("hide")
                }
            })
        }
    }

    function resetCSS() {
        allRows.forEach(row => row.classList.remove("hide"))
    }

    function resetFilter() {
        filter = []
        resetCSS()
        Object.keys(wowClasses).forEach(wowClass => {
            document.querySelector(`#wow-ladder-filter--${wowClass.toUpperCase()} .GameIcon-icon`).style = "opacity: 0.3;"
            document.querySelector(`#wow-ladder-filter--${wowClass.toUpperCase()} .GameIcon-borderImage`).style = "display: none;"
        })
    }

    const container = document.querySelector(".Pane--dirtBlue .Pane-content")
    const fractionContainer = container.querySelector(".align-right")
    const allRows = Array.prototype.slice.call(document.querySelectorAll(".Paginator .SortTable-row"), 1)

    const btn = document.createElement("button")
    btn.onclick = resetFilter
    btn.innerHTML = "Reset"
    btn.style = "display: inline-block!important;float: left;padding: 15px;color: #f8b700;"

    const filterContainer = document.createElement("div")
    filterContainer.style = "float: left;"
    filterContainer.appendChild(btn)
    fractionContainer.appendChild(filterContainer)
    Object.keys(wowClasses).forEach(wowClass => filterContainer.appendChild(createGameIcon(wowClass)))
})();
