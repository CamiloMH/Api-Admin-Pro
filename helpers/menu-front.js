

const getMenuFront = (role = 'USER_ROLE') => {
    const menu = [
        {
            title: 'Principal',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Dashboard', url: '/' },
                { title: 'ProgressBar', url: 'progress' },
                { title: 'Gráficas', url: 'grafica1' },
                { title: 'Promesas', url: 'promesas' },
                { title: 'Rxjs', url: 'rxjs' },
            ]
        },
        {
            title: 'Mantenimiento',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                // { title: 'Usuarios', url: 'usuarios' },
                { title: 'Hospitales', url: 'hospitales' },
                { title: 'Médicos', url: 'medicos' },
            ]
        },
    ];

    if (role === 'ADMIN_ROLE') {

        menu[1].submenu.unshift({ title: 'Usuarios', url: 'usuarios' })
    }


    return menu;
}

module.exports = {
    getMenuFront,
}