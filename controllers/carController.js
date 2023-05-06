const { Car } = require("../models");

//get all data mobil
exports.getCars = async (req, res) => {
    try {
        const cars = await Car.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                is_deleted: 0
            }
        });
        res.status(200).json({
            success: true,
            message: "List All Cars",
            data: cars,
        });
    } catch (error) {
        console.log(error);
    }
};

//get data mobil by id
exports.getCarById = async (req, res) => {
    try {
        const id = req.params.id
        const cars = await Car.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                is_deleted: 0,
                id: id
            }
        });
        res.status(200).json({
            success: true,
            message: "List car by id",
            data: cars,
        });
    } catch (error) {
        console.log(error);
    }
};

//get all data mobil yang terdelete (is_deleted = 0)
exports.getDeletedCars = async (req, res) => {
    try {
        const cars = await Car.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                is_deleted: 1
            }
        });
        res.status(200).json({
            success: true,
            message: "List All Deleted Cars",
            data: cars,
        });
    } catch (error) {
        console.log(error);
    }
};

// deleteCar
exports.deleteCar = async (req, res) => {
    try {
        const id = req.params.id
        const tokenUser = req.user
        const { body } = req

        console.log(tokenUser.role);

        // validasi agar member tidak bisa melakukan operasi ini
        if (tokenUser.role === "member") {
            return res.status(200).json({
                success: false,
                message: "role member tidak boleh melakukan operasi API ini",

            });
        }

        body.is_deleted = 1 //set is_deleted = 1
        body.user_id = tokenUser.userId //set tokenUser yang login

        await Car.update(body, {
            where: {
                id: id,
            },
        });

        //untuk nampilkan response
        const updatedDate = await Car.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { id: id }
        });

        res.status(200).json({
            success: true,
            message: "Delete mobil berhasil",
            data: updatedDate,
        });
    } catch (error) {
        console.log(error);
    }
};

//updateCar
exports.updateCar = async (req, res) => {
    try {
        const id = req.params.id
        const tokenUser = req.user
        const { body } = req

        // validasi agar member tidak bisa melakukan operasi ini
        if (tokenUser.role === "member") {
            return res.status(200).json({
                success: false,
                message: "role member tidak boleh melakukan operasi API ini",

            });
        }

        body.user_id = tokenUser.userId //set tokenUser yang login untuk agar bisa tau siapa yang update car ini

        console.log(body);
        await Car.update(body, {
            where: {
                id: id,
            },
        });

        //untuk nampilkan response
        const updatedDate = await Car.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { id: id }
        });

        res.status(200).json({
            success: true,
            message: "Update mobil berhasil",
            data: updatedDate,
        });
    } catch (error) {
        console.log(error);
    }
};

//createCar
exports.createCar = async (req, res) => {
    try {
        const tokenUser = req.user
        const { body } = req

        // validasi agar member tidak bisa melakukan operasi ini
        if (tokenUser.role === "member") {
            return res.status(200).json({
                success: false,
                message: "role member tidak boleh melakukan operasi API ini",

            });
        }

        body.is_deleted = 0 // set is_deleted = 0
        body.user_id = tokenUser.userId //set tokenUser yang login untuk agar bisa tau siapa yang update car ini

        const createdData = await Car.create(body);

        // const parsedData = JSON.stringify(createdData)
        res.status(200).json({
            success: true,
            message: "mobil berhasil ditambahkan",
            data: createdData,
        });
    } catch (error) {
        console.log(error);
    }
};