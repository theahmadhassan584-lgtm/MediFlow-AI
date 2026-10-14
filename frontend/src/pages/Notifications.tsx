import { useState } from 'react';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import type { NotificationCategory } from '../types/index.ts';
import { useNavigate } from 'react-router-dom';

export const Notifications = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
  } = useApp();

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | NotificationCategory>('all');

  const filteredNotifications = notifications.filter((n) => {
    return selectedCategory === 'all' || n.category === selectedCategory;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Clinical Alerts & Notification Logs</h2>
          <p className="page-subtitle">
            Critical lab flags, ER triage events, pharmacovigilance alerts, and system handovers
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={markAllNotificationsRead}
          >
            <CheckCheck size={16} />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="toolbar-card">
        <div className="segmented-control">
          {(['all', 'clinical', 'lab', 'emergency', 'system'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`segment-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All Alerts' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list-container">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={36} className="text-muted mb-2" />
            <p>No notifications found in this category.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const icon =
              notif.severity === 'critical' ? (
                <AlertTriangle size={20} className="text-danger" />
              ) : notif.severity === 'warning' ? (
                <AlertTriangle size={20} className="text-warning" />
              ) : notif.severity === 'success' ? (
                <CheckCircle2 size={20} className="text-success" />
              ) : (
                <Info size={20} className="text-primary" />
              );

            return (
              <div
                key={notif.id}
                className={`notification-card-item ${notif.isRead ? 'read' : 'unread'} ${notif.severity}`}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.linkTo) navigate(notif.linkTo);
                }}
              >
                <div className={`notif-status-bar ${notif.severity}`} />

                <div className="notif-card-icon-box">{icon}</div>

                <div className="notif-card-main">
                  <div className="notif-card-title-row">
                    <h4>{notif.title}</h4>
                    <span className="notif-time-tag">
                      <Clock size={12} />
                      <span>{notif.timestamp}</span>
                    </span>
                  </div>

                  <p className="notif-card-message">{notif.message}</p>

                  <div className="notif-card-footer-tags">
                    <span className={`category-tag ${notif.category}`}>
                      {notif.category.toUpperCase()}
                    </span>
                    <span className={`severity-tag ${notif.severity}`}>
                      {notif.severity.toUpperCase()}
                    </span>

                    {notif.linkTo && (
                      <span className="notif-jump-link">
                        <span>Review details</span>
                        <ArrowRight size={13} />
                      </span>
                    )}
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    type="button"
                    className="mark-read-pill-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(notif.id);
                    }}
                    title="Mark as read"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
