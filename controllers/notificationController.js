const Notification = require('../models/Notification');
const Membership = require('../models/Membership');

// Generate expiry reminders (Admin/Cron)
const generateExpiryReminders = async (req, res, next) => {
  try {
    const daysThreshold = 7;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysThreshold);

    // Find all active memberships that expire within the next `daysThreshold` days
    // but haven't expired yet (so end date > now and end date <= targetDate)
    const currentDate = new Date();
    
    const expiringMemberships = await Membership.find({
      status: 'Active',
      endDate: { 
        $gt: currentDate, 
        $lte: targetDate 
      }
    });

    let notificationsCreated = 0;

    for (const membership of expiringMemberships) {
      // Check if there is already an unread ExpiryReminder for this member
      // to avoid spamming them every time the cron job runs
      const existingNotification = await Notification.findOne({
        memberId: membership.memberId,
        type: 'ExpiryReminder',
        status: 'Unread'
      });

      if (!existingNotification) {
        const endDateStr = membership.endDate.toISOString().split('T')[0];
        
        await Notification.create({
          memberId: membership.memberId,
          message: `Reminder: Your gym membership will expire soon on ${endDateStr}. Please renew to keep your access active!`,
          type: 'ExpiryReminder'
        });
        notificationsCreated++;
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully processed expiry checks. Generated ${notificationsCreated} new reminders.`,
      data: {
        totalExpiringFound: expiringMemberships.length,
        notificationsCreated
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get notifications for the logged-in member
const getMemberNotifications = async (req, res, next) => {
  try {
    const memberId = req.user.id;

    const notifications = await Notification.find({ memberId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const { id: notificationId } = req.params;
    const memberId = req.user.id;

    // Find and verify ownership
    const notification = await Notification.findOne({ _id: notificationId, memberId });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        errorCode: '404'
      });
    }

    notification.status = 'Read';
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateExpiryReminders,
  getMemberNotifications,
  markAsRead
};
