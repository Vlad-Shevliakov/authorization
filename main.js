var addFonts = () => {
    var fontTag = document.createElement('link')
    fontTag.href = 'https://fonts.googleapis.com/css?family=Exo+2:400,700'
    fontTag.rel = 'stylesheet'
    document.head.insertBefore(fontTag, document.head.lastElementChild)
    document.body.style.fontFamily = "'Exo 2', Tahoma, sans-serif"
}
addFonts()

var incorrectAuth = message => {
    var cont = document.querySelector('.container')
    cont.classList.add('error-auth-animation')
    var p = document.querySelector('.info')
    p.textContent = message
    setTimeout(() => {
        cont.classList.remove('error-auth-animation')
        p.textContent = ''
    }, 700)

}

var usersData = newUser => {
    if (!localStorage.length) {
        localStorage.setItem('usersArray', JSON.stringify([]))
        var array = JSON.parse(localStorage['usersArray'])
        array.push(newUser)
        localStorage.setItem('usersArray', JSON.stringify(array))
        return
    }
    var arr = JSON.parse(localStorage['usersArray'])

    if (arr.indexOf(newUser) >= 0) {
        incorrectAuth('This user already exists!')
    } else {
        var array = JSON.parse(localStorage['usersArray'])
        array.push(newUser)
        localStorage.setItem('usersArray', JSON.stringify(array))
        return
    }
}

// 4
var nextPage = user => {
    var obj = JSON.parse(localStorage[user])
        obj.lastPage = 'next-page'
    localStorage.setItem(user, JSON.stringify(obj))

    var cont = document.querySelector('.container')
        cont.classList.add('next-page--container')
    function deleteChild(node) {
        var child
        while (child = node.lastChild) {
            node.removeChild(child)
        }
    }
    deleteChild(cont)

    var info = cont.appendChild(document.createElement('h2'))
    info.style.textAlign = 'center'
    var inp = cont.appendChild(document.createElement('input'))
        inp.type = 'file'
        inp.id = 'inp-file'
    var label = cont.appendChild(document.createElement( 'label' ))
        label.htmlFor = 'inp-file'
        label.textContent = 'Upload a picture here!'
    var img = cont.appendChild(document.createElement('img'))
        img.width = 444
        img.classList.add('next-img')
    var backBtn = cont.appendChild(document.createElement('button'))
        backBtn.textContent = 'back'
        backBtn.classList.add('back-btn')
    var chatBtn = cont.appendChild(document.createElement('button'))

    backBtn.onclick = function(event) {
        deleteChild(cont)
        homePage(user)
        var obj = JSON.parse(localStorage[user])
            obj.lastPage = 'home-page'
        localStorage.setItem(user, JSON.stringify(obj))
    }

    inp.onchange = function(event) {
        var promise = new Promise( (res, rej) => {
            var file = this.files[0].type.split('/')
            if (file[0] === 'image') {
                res(event.target.files[0])
            } else {
                rej()
            }
        }).then( file => {
            var readFile = new FileReader()
            readFile.readAsDataURL(file)
            readFile.onload = function(event) {
                img.src = event.target.result
                label.textContent = 'Clik to upload'
            }
        }, () => {
            throw new Error('This is not a picture!')
        }).catch(error => info.textContent = error)

    }
}


function homePage(hash) {
    var user = hash
    var cont = document.querySelector('.container')
    cont.classList.add('auth-true')

    function deleteChild(node) {
        var child
        while (child = node.lastChild) {
            node.removeChild(child)
        }
    }
    deleteChild(cont)

    var firsContainer = document.createElement('div')
    firsContainer.classList.add('cont_1')
    cont.appendChild(firsContainer)
    var mainImg = firsContainer.appendChild(document.createElement('img'))
    mainImg.classList.add('home-img')
    
    if(!mainImg.src) mainImg.src = 'img/default-image.png'

    var wrapper = firsContainer.appendChild(document.createElement('div'))
    wrapper.classList.add('avatars-wrap')
    var avatarTitle = wrapper.appendChild(document.createElement('h1'))
    avatarTitle.textContent = 'Choose an avatar!'
    avatarTitle.style = `
            text-align: center;
            font-size: 20px;
            flex-grow: 5;
        `;
    var imgContainer = wrapper.appendChild(document.createElement('div'))
    imgContainer.classList.add('img-container')

    if (user in localStorage) {
        var obj = JSON.parse(localStorage[user])
        mainImg.src = obj.url
    } else {
        var newObject = { lastPage: 'home-page', url: 'img/default-image.png' }
        localStorage.setItem(user, JSON.stringify(newObject))
    }

    var avatars = ['img/cartman.png', 'img/lisa.png', 'img/pepe.png', 'img/fox.png']
    avatars.forEach(link => {
        var prewImg = document.createElement('img')
        prewImg.classList.add('preview-img')
        prewImg.src = link
        imgContainer.appendChild(prewImg)
        prewImg.onclick = function (event) {
            mainImg.src = this.src

            var obj = JSON.parse(localStorage[user])
            obj.url = this.src
            localStorage.setItem(user, JSON.stringify(obj))
        }
    })

    ///////////// ВРЕМЕННО
    var info_1 = cont.appendChild(document.createElement('h1'))
    var info_2 = cont.appendChild(document.createElement('p'))
    info_1.textContent = 'Press "Esc" to exit!'
    info_1.style.textAlign = 'center'
    var userObj = JSON.parse(localStorage[user])

    if (!userObj.lastVisit) {
        info_2.textContent = 'Last visit: now'
    } else {
        info_2.textContent = `Last visit: ${userObj.lastVisit}`
    }

    info_2.style.textAlign = 'center'
    var nextBtn = cont.appendChild(document.createElement('button'))
        nextBtn.textContent = 'next'
        nextBtn.classList.add('next-btn')
    //////////////
        //exit
    // window.onkeydown = function (event) {
    //     if (event.keyCode === 27) {
    //         event.preventDefault()
    //         if () {

    //         }
    //         var obj = JSON.parse(localStorage[user])
    //         obj.lastVisit = new Date().toLocaleTimeString().substr(0, 5)
    //         localStorage.setItem(user, JSON.stringify(obj))
    //         cont.parentNode.removeChild(cont)
    //         firstModal()
    //     }
    // }

    var exitFunction = event => {
        if (document.querySelector('.container')) {
            var obj = JSON.parse(localStorage[user])
            obj.lastVisit = new Date().toLocaleTimeString().substr(0, 5)
            localStorage.setItem(user, JSON.stringify(obj))
            cont.parentNode.removeChild(cont)
            firstModal()
        }
    }

    cont.addEventListener('exit', exitFunction)

    window.addEventListener('keydown', event => {
        if (event.keyCode === 27) {
            cont.dispatchEvent(new CustomEvent('exit'))
        }
    })


    // next page
    nextBtn.onclick = function(event) {
        deleteChild(cont)
        nextPage(user)
    }
}







var userAuth = objHash => {
    if (!localStorage.length) {
        incorrectAuth('No such user!')
        return null
    }
    var arr = JSON.parse(localStorage['usersArray'])
    function openLastPage() {
        if (arr.indexOf(Sha256.hash(objHash)) == -1) {
            incorrectAuth('No such user!')
        } else {
            if (Sha256.hash(objHash) in localStorage) {
                var obj = JSON.parse(localStorage.getItem(Sha256.hash(objHash)))
                obj.lastPage === 'next-page' ? nextPage(Sha256.hash(objHash)) : homePage(Sha256.hash(objHash))
            } else {
                homePage(Sha256.hash(objHash))
            }
        }
    }

    arr.indexOf(Sha256.hash(objHash)) == -1 ? incorrectAuth('No such user!') : openLastPage()
}






function firstModal() {
    if (!(document.querySelector('#sha-script'))) { // если нет, вернет null
        var sha_js = document.createElement('script')
            sha_js.src = 'https://cdn.rawgit.com/chrisveness/crypto/4e93a4d/sha256.js'
            sha_js.integrity = 'sha384-KRBAf263if8ArQhh23bChqfR8z1cSWrQ3rtnPaSgD3C2uhv8k2hBV0nhcpLZAH3o'
            sha_js.crossOrigin = 'anonymous'
            sha_js.id = 'sha-script'
        document.head.appendChild(sha_js)
    }

    var cont = document.body.appendChild(document.createElement('div'))
    cont.classList.add('container')
    var inpMail = cont.appendChild(document.createElement('input'))
    inpMail.type = 'email'
    inpMail.placeholder = 'email'

    var iPass = cont.appendChild(document.createElement('input'))
    iPass.type = 'password'
    iPass.placeholder = 'password'

    inpMail.classList.add('user-mail')
    iPass.classList.add('user_pass')

    var par = cont.appendChild(document.createElement('p'))
    par.classList.add('info')

    var infoPar = cont.appendChild(document.createElement('p'))

    infoPar.classList.add('info')
    var btnContainer = cont.appendChild(document.createElement('div'))
    btnContainer.style = `
            width: 226px;
            margin: 0 auto;
        `
    var btn_1 = btnContainer.appendChild(document.createElement('button'))
    btn_1.textContent = 'sign up'
    btn_1.classList.add('modal-btn')
    btn_1.classList.add('rg-btn')
    var btn_2 = btnContainer.appendChild(document.createElement('button'))
    btn_2.textContent = 'log in'
    btn_2.classList.add('modal-btn')
    btn_2.classList.add('ln-btn')

    // events 
    // events sign up
    btn_1.onclick = function (event) {
        var pass = !iPass.value ? incorrectAuth() : iPass.value[0] !== ' ' ? true : incorrectAuth()
        var mail = !inpMail.value ? incorrectAuth() : true
        if (pass && mail) usersData(Sha256.hash(inpMail.value + iPass.value))
    }
    // events log in
    btn_2.onclick = function (event) {
        var pass = !iPass.value ? incorrectAuth() : iPass.value[0] !== ' ' ? true : incorrectAuth()
        var mail = !inpMail.value ? incorrectAuth() : true
        if (pass && mail) userAuth(inpMail.value + iPass.value)
    }
    return cont
}

firstModal()