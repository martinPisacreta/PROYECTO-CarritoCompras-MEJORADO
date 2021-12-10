import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

import MobileMainNav from './partials/mobile-nav';

export default function MobileMenu() {
    return (
        <div className="mobile-menu-container mobile-menu-light">
            <div className="mobile-menu-wrapper">
                <span className="mobile-menu-close"><i className="icon-close"></i></span>

                <Tabs defaultIndex={ 0 } selectedTabClassName="show">
                    <TabList className="nav nav-pills-mobile nav-border-anim" role="tablist">
                        <Tab className="nav-item">
                            <span className="nav-link">Menu</span>
                        </Tab>
                    </TabList>

                    <div className="tab-content">
                        <TabPanel>
                            <MobileMainNav />
                        </TabPanel>

                    </div>
                </Tabs>
            </div>
        </div>
    )
}