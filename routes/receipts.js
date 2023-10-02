const express = require('express');
const router = express.Router();

const { processReceipt } = require('../controllers/receipts_controller');
const { v4: uuidv4 } = require('uuid');

const receiptsProcessed = {};

/**
 * @swagger
 * components:
 *   schemas:
 *     Receipt:
 *       type: object
 *       required:
 *         - retailer
 *         - purchaseDate
 *         - purchaseTime
 *         - items
 *         - total
 *       properties:
 *         retailer:
 *           description: The name of the retailer or store the receipt is from.
 *           type: string
 *           pattern: '^\S+$'
 *           example: "Target"
 *         purchaseDate:
 *           description: The date of the purchase printed on the receipt.
 *           type: string
 *           format: date
 *           example: "2022-01-01"
 *         purchaseTime:
 *           description: The time of the purchase printed on the receipt. 24-hour time expected.
 *           type: string
 *           format: time
 *           example: "13:01"
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: "#/components/schemas/Item"
 *         total:
 *           description: The total amount paid on the receipt.
 *           type: string
 *           pattern: '^\d+\.\d{2}$'
 *           example: "6.49"
 *     Item:
 *      type: object
 *      required:
 *         - shortDescription
 *         - price
 *      properties:
 *         shortDescription:
 *             description: The Short Product Description for the item.
 *             type: string
 *             pattern: "^[\\w\\s\\-]+$"
 *             example: "Mountain Dew 12PK"
 *         price:
 *             description: The total price payed for this item.
 *             type: string
 *             pattern: "^\\d+\\.\\d{2}$"
 *             example: "6.49"
 */

/**
 * @swagger
 * /receipts/process:
 *   post:
 *     summary: Submits a receipt for processing
 *     description: Submits a receipt for processing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Receipt"
 *     responses:
 *       200:
 *         description: Returns the ID assigned to the receipt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   pattern: '^\S+$'
 *                   example: adb6b560-0eef-42bc-9d16-df48f30e89b2
 *       400:
 *         description: The receipt is invalid
 */
 router.post('/process', (req, res) => {
    try {
      // Extract data from the request body
      const receiptData = req.body;
  
      // Process the receipt and calculate the points using the controller function
      const points = processReceipt(receiptData);

      const receiptId = uuidv4();
  
      // Return the total points awarded
      res.status(200).json({ id: receiptId });

      receiptsProcessed[receiptId] = points;
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'The receipt is invalid' });
    }
  });

/**
 * @swagger
 * /receipts/{id}/points:
 *   get:
 *     summary: Returns the points awarded for the receipt
 *     description: Returns the points awarded for the receipt
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the receipt
 *         schema:
 *           type: string
 *           pattern: '^\S+$'
 *     responses:
 *       200:
 *         description: The number of points awarded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 points:
 *                   type: integer
 *                   format: int64
 *                   example: 100
 *       400:
 *         description: Error while fetching the receipt with the given ID
 */
router.get('/:id/points', (req, res) => {
    try {
        const receiptId = req.params.id;
    
        let points = receiptsProcessed[receiptId];
    
        res.status(200).json({ points });
    } catch (error) {
        console.error(error);

        res.status(400).json({ message: 'Error while fetching the receipt with the given ID'});
    }
});


/**
 * @swagger
 * /receipts/all:
 *   get:
 *     summary: Returns the points and IDs for all receipts
 *     description: Returns the points of all receipts and its IDs
 *     responses:
 *       200:
 *         description: An object with all the receipts IDs and their points
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   pattern: '^\S+$'
 *                   example: adb6b560-0eef-42bc-9d16-df48f30e89b2
 *                 points:
 *                   type: integer
 *                   format: int64
 *                   example: 100
 *       400:
 *         description: Something went wrong while fetching receipts
 */
router.get('/all', (req, res) => {
    try {
        res.status(200).json({ receipts: receiptsProcessed });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Something went wrong while fetching receipts'})
    }
});

module.exports = router;
