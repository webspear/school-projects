menuOpen = false
document.getElementById('menu-btn').onclick = () => {
    if (!menuOpen) {
        document.getElementById('menu').style.transform = 'translateX(-250px)'
        document.getElementById('unfocus').style.visibility = 'visible'
        document.getElementById('unfocus').style.opacity = '1'
        menuOpen = true
    }
}
document.getElementById('close-btn').onclick = () => {
    if (menuOpen) {
        document.getElementById('menu').style.transform = 'translateX(250px)'
        document.getElementById('unfocus').style.opacity = '0'
        document.getElementById('unfocus').style.visibility = 'hidden'
        menuOpen = false
    }
}
document.querySelectorAll('.options').forEach(element => {
    element.addEventListener('mouseenter', function() {
        element.textContent = ' > ' + element.textContent
    })
    element.addEventListener('mouseleave', function() {
        element.textContent = element.textContent.replace(' > ', '')
    })
    element.addEventListener('click', function() {
        document.getElementById('menu').style.transform = 'translateX(250px)'
        document.getElementById('unfocus').style.opacity = '0'
        document.getElementById('unfocus').style.visibility = 'hidden'
        menuOpen = false
    })
})


function loop() {
    const arrow = document.getElementById('arrow')
    arrow.style.transform = 'translateY(50px)'
    
    setTimeout(() => {
        arrow.style.transform = 'translateY(0px)'
        
        setTimeout(() => {
            loop()
        }, 500)
    }, 500)
}

loop();