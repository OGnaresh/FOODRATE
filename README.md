<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>RestaurantMatch - Find Your Perfect Dining</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app"></div>

    <!-- MODALS -->
    <div id="auth-modal" class="modal" hidden>
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">&times;</button>
            <div id="modal-body"></div>
        </div>
    </div>

    <!-- TOAST NOTIFICATIONS -->
    <div id="toast" class="toast" role="status" aria-live="polite"></div>

    <script src="data.js"></script>
    <script src="app.js"></script>
</body>
</html>
