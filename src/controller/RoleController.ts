import { NextFunction, Request, Response } from 'express';
import { findAllRoles, removeRole, saveRole, findRoleByName, createRole, findRoleById } from '../services/role.service';
import ApiError from '../utils/apiError';
import { ROLE_DOESNT_EXIST, ROLE_ALREADY_EXISTS } from '../data/errors';

export const getAllRoles = async (request: Request, response: Response, next: NextFunction) => {
    const data = await findAllRoles();
    return response.send(data);
};

export const addRole = async (request: Request, response: Response, next: NextFunction) => {
    const { name } = request.body;

    const existingRole = await findRoleByName(name);
    if (existingRole) {
        return next(new ApiError(ROLE_ALREADY_EXISTS));
    }

    const role = await createRole({ name });
    response.status(201).send(role);
};

export const deleteRole = async (request: Request, response: Response, next: NextFunction) => {
    let id = request.params.id;

    const role = await findRoleById(id);

    if (!role) {
        return next(new ApiError(ROLE_DOESNT_EXIST));
    }

    await removeRole(role);

    return response.status(204).send();
};
