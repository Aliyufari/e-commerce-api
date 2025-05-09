import { Router } from "express";
import { index } from "../controllers/roleController";
import { hasPermission, hasRole } from "../middlewares/authMiddleware";

const roleRouter = Router();

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get role list
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *       500:
 *         description: Error fetching roles  
 */
roleRouter.route('/').get(hasRole('admin'), hasPermission('view-role'), index)

export default roleRouter;