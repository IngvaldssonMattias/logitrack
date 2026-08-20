// ROUTER.POST SWAGGER (Create An Shipment)
/**
 * @swagger
 * /api/v1/shipments:
 *   post:
 *     summary: Create a new shipment
 *     description: Creates a new shipment.
 *     tags:
 *       - Shipments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trackingNumber
 *               - senderAddress
 *               - destinationAddress
 *               - weightInKg
 *               - estimatedDelivery
 *             properties:
 *               trackingNumber:
 *                 type: string
 *                 example: API500001
 *               senderAddress:
 *                 type: string
 *                 example: Stockholm, Sweden
 *               destinationAddress:
 *                 type: string
 *                 example: Gothenburg, Sweden
 *               weightInKg:
 *                 type: number
 *                 example: 10
 *               estimatedDelivery:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-25
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Invalid shipment data
 */

// ROUTER.GET("/:ID") SWAGGER (Get Shipments With ID)
/**
 * @swagger
 * /api/v1/shipments/{id}:
 *   get:
 *     summary: Get a shipment by ID
 *     description: Returns a single shipment using its MongoDB ID.
 *     tags:
 *       - Shipments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the shipment
 *     responses:
 *       200:
 *         description: Successfully retrieved the shipment
 *       404:
 *         description: Shipment not found
 */


// ROUTER.GET SWAGGER(GetAllShipments) 
/**
 * @swagger
 * /api/v1/shipments:
 *   get:
 *     summary: Get all shipments
 *     description: Returns a list of all shipments.
 *     tags:
 *       - Shipments
 *     responses:
 *       200:
 *         description: Successfully retrieved all shipments
*/


// ROUTER.PATCH SWAGGER (UPDATE)
/**
 * @swagger
 * /api/v1/shipments/{id}:
 *   patch:
 *     summary: Update a shipment
 *     description: Updates one or more fields of an existing shipment.
 *     tags:
 *       - Shipments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the shipment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderAddress:
 *                 type: string
 *                 example: Stockholm, Sweden
 *               destinationAddress:
 *                 type: string
 *                 example: Malmö, Sweden
 *               weightInKg:
 *                 type: number
 *                 example: 15
 *               estimatedDelivery:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-27
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - IN_TRANSIT
 *                   - DELAYED
 *                   - DELIVERED
 *                 example: IN_TRANSIT
 *     responses:
 *       200:
 *         description: Shipment updated successfully
 *       400:
 *         description: Invalid shipment data
 *       404:
 *         description: Shipment not found
 */


// ROUTER.DELETE SWAGGER
/**
 * @swagger
 * /api/v1/shipments/{id}:
 *   delete:
 *     summary: Delete a shipment
 *     description: Deletes an existing shipment using its MongoDB ID.
 *     tags:
 *       - Shipments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the shipment
 *     responses:
 *       200:
 *         description: Shipment deleted successfully
 *       400:
 *         description: Invalid shipment ID
 *       404:
 *         description: Shipment not found
 */