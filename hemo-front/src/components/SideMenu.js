import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showStaffSubmenu, setShowStaffSubmenu] = useState(false);
  const [showEquipmentSubmenu, setShowEquipmentSubmenu] = useState(false);
  const location = useLocation();

  const role = localStorage.getItem('role') || 'User';
 ;

  // Define which menu items are disabled based on role
  const disabledMenus = {
    MEDICAL_PARA_STAFF: ['staff', 'equipment', 'export-report'],
    TECHNICAL: ['staff', 'export-report', 'patients'],
    SUBMITTER: ['staff', 'patients', 'equipment'],
    VIEWER: ['patients', 'staff', 'equipment', 'export-report'],
  };

  // Get disabled menu items for the current role (empty array for unlisted roles, e.g., LOCAL_ADMIN)
  const disabledItems = disabledMenus[role] || [];

  // Check if a menu item is disabled
  const isDisabled = (menuKey) => disabledItems.includes(menuKey);

  const toggleMenu = () => {
    ;
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setShowStaffSubmenu(false);
      setShowEquipmentSubmenu(false);
    }
  };

  const toggleStaffSubmenu = () => {
    if (isCollapsed || isDisabled('staff')) return;
    ;
    setShowStaffSubmenu(!showStaffSubmenu);
  };

  const toggleEquipmentSubmenu = () => {
    if (isCollapsed || isDisabled('equipment')) return;
    ;
    setShowEquipmentSubmenu(!showEquipmentSubmenu);
  };

  // Check if the current path is under the staff or equipment submenu
  const isStaffPath = location.pathname.startsWith('/home/staff/');
  const isEquipmentPath = location.pathname.startsWith('/home/equipment/');
  useEffect(() => {
    if (!isCollapsed && !isDisabled('staff') && isStaffPath) {
      setShowStaffSubmenu(true);
    }
    if (!isCollapsed && !isDisabled('equipment') && isEquipmentPath) {
      setShowEquipmentSubmenu(true);
    }
  }, [location.pathname, isCollapsed, isStaffPath, isEquipmentPath]);

  return (
    <div className={`side-menu ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={toggleMenu}>
        {isCollapsed ? '▶' : '◄'}
      </button>
      <ul>
        <li>
          <NavLink
            to="/home/patients"
            className={({ isActive }) =>
              `${isActive ? 'active' : ''} ${isDisabled('patients') ? 'disabled' : ''}`
            }
            onClick={() => {
              setShowStaffSubmenu(false);
              setShowEquipmentSubmenu(false);
            }}
          >
            <span className="icon">👥</span>
            <span className="label">Patients</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="#"
            className={({ isActive }) =>
              `${isActive || isStaffPath ? 'active' : ''} ${isDisabled('staff') ? 'disabled' : ''}`
            }
            onClick={toggleStaffSubmenu}
          >
            <span className="icon">🧑‍⚕️</span>
            <span className="label">
              Staff {showStaffSubmenu && !isCollapsed && !isDisabled('staff') ? '▼' : '▶'}
            </span>
          </NavLink>
          {showStaffSubmenu && !isCollapsed && !isDisabled('staff') && (
            <ul className="submenu">
              <li>
                <NavLink
                  to="/home/staff/administrative"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="icon">📋</span>
                  <span className="label">Administrative Staff</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home/staff/medical"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="icon">🩺</span>
                  <span className="label">Medical Staff</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home/staff/paramedical"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="icon">💉</span>
                  <span className="label">Paramedical Staff</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home/staff/technical"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="icon">🔧</span>
                  <span className="label">Technical Staff</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home/staff/worker"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="icon">🧹</span>
                  <span className="label">Worker Staff</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li>
          <NavLink
            to="#"
            className={({ isActive }) =>
              `${isActive || isEquipmentPath ? 'active' : ''} ${isDisabled('equipment') ? 'disabled' : ''}`
            }
            onClick={toggleEquipmentSubmenu}
          >
            <span className="icon">🛠️</span>
            <span className="label">
              Equipment {showEquipmentSubmenu && !isCollapsed && !isDisabled('equipment') ? '▼' : '▶'}
            </span>
          </NavLink>
          {showEquipmentSubmenu && !isCollapsed && !isDisabled('equipment') && (
            <ul className="submenu">
              <li>
                <NavLink
                  to="/home/equipment/list"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="icon">📋</span>
                  <span className="label">Machine List</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li>
          <NavLink
            to="/home/export-report"
            className={({ isActive }) =>
              `${isActive ? 'active' : ''} ${isDisabled('export-report') ? 'disabled' : ''}`
            }
            onClick={() => {
              setShowStaffSubmenu(false);
              setShowEquipmentSubmenu(false);
            }}
          >
            <span className="icon">📄</span>
            <span className="label">Export Report</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/home/center-details"
            className={({ isActive }) =>
              `${isActive ? 'active' : ''} ${isDisabled('center-details') ? 'disabled' : ''}`
            }
            onClick={() => {
              setShowStaffSubmenu(false);
              setShowEquipmentSubmenu(false);
            }}
          >
            <span className="icon">🏥</span>
            <span className="label">Center Details</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/home/user-profile"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => {
              setShowStaffSubmenu(false);
              setShowEquipmentSubmenu(false);
            }}
          >
            <span className="icon">👤</span>
            <span className="label">Profile</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;