import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Include user info (e.g., userId, role)
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

export const restrictAdminRegistration = (req, res, next) => {
    const secretKey = req.headers['x-admin-secret']; // Pass secret in headers
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
};

export const restrictAdmin = (req, res, next) => {
    const { role } = req.user;  // Assuming role is added to the decoded JWT payload

    if (role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
};


