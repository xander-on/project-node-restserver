const { response } = require('express');
const bcryptjs     = require('bcryptjs');
const User         = require('../models/user');

const usersGet = async(req, res = response) => {

    const { limit=10, from=0 } = req.query;

    const query = { state: true }

    // const total = users.length;

    const [total, users ] = await Promise.all([
        User.count(query),
        User.find(query)
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.json({ total, users });
}


const userPost = async(req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    //encriptar la contrasena
    const salt    = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );
    // user.role = 'USER_ROLE';
    //guardar en bd
    await user.save();

    res.json({
        user
    });
}


const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    if( password ){
        //encriptar la contrasena
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await User.findByIdAndUpdate( id, resto );
    res.json({ usuario });
}


const userPatch = (req, res = response) => {
    res.json({
        "msg":"patch API - controller"
    });
}


const usersDelete = async(req, res = response) => {

    const { id } = req.params;

    //borrado logico
    const user = await User.findByIdAndUpdate( id, { state:false });
    const userAutenticado = req.user

    res.json({user, userAutenticado});
}


module.exports = {
    usersGet,
    userPost,
    usersPut,
    userPatch,
    usersDelete
}
