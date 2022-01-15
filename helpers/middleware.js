// Handles GET requests to /reviews
// Query params:
//   page (default: 1), count (default: 5), sort (by 'newest', 'helpful', 'relevant'), product_id

// 1. From DB 'product' Table, of interest are:
//    col 1, "id": 1 -> "product": String(1 + 40343) in RETURNED
//    col 2, "name": "Camo Onesie" -> Product name in Modal??

// let product_id_adjustor = 40343;
