// middlewares/validateSearchParams.js
export const validateSearchParams = (req, res, next) => {
    const { area_ocupacion, tipo_area_ocupacion, palabra_clave, region_residencia } = req.body;

    // Verificar si alguno de los parámetros necesarios está presente (ajusta según tus requerimientos)
    if (!area_ocupacion && !tipo_area_ocupacion && !palabra_clave && !region_residencia) {
        return res.status(400).json({ message: 'Se requiere al menos un parámetro de búsqueda.' });
    }

    // Aquí puedes agregar más validaciones específicas si es necesario

    next(); // Si todo está bien, pasa al siguiente middleware o controlador
};
