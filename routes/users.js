const { Router }        = require('express');
const { check }         = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router            = Router();

const {
    isValidRole,
    emailExiste,
    existsUserById
} = require('../helpers/db-validators');

const {
    usersGet,
    usersPost,
    usersPut,
    userPatch,
    usersDelete
} = require('../controllers/users');

const validatorsPost = [
    check('name',     'El nombre es obligatorio').not().isEmpty(),
    check('email',    'El correo no es valido').isEmail(),
    check('email').custom( emailExiste ),
    check('password', 'El password debe de ser mayor a 6 letras').isLength({ min:6 }),
    check('role').custom( isValidRole ),
    validarCampos
];


const validatorsPut = [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existsUserById ),
    check('role').custom( isValidRole ),
    validarCampos
];


const validatorDelete = [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existsUserById ),
    validarCampos
];

router.get   ('/',    usersGet);
router.post  ('/',    validatorsPost,  usersPost);
router.put   ('/:id', validatorsPut,   usersPut);
router.delete('/:id', validatorDelete, usersDelete);
router.patch ('/',    userPatch);






module.exports = router;
