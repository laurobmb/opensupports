import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import Header from 'core-components/header';
import TicketList from 'app-components/ticket-list';

class AdminPanelNewTickets extends React.Component {

    static defaultProps = {
        departments: [],
        tickets: []
    };

    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveNewTickets());
    }

    render() {
        return (
            <div className="admin-panel-my-tickets">
                <Header title={i18n('NEW_TICKETS')} description={i18n('NEW_TICKETS_DESCRIPTION')} />
                <TicketList {...this.getProps()}/>
            </div>
        );
    }

    getProps() {
        return {
            departments: this.props.departments,
            tickets: this.props.tickets,
            type: 'secondary',
            loading: this.props.loading,
            ticketPath: '/admin/panel/tickets/view-ticket/'
        };
    }
}

export default connect((store) => {
    return {
        departments: store.session.userDepartments,
        tickets: store.adminData.newTickets,
        loading: !store.adminData.newTicketsLoaded
    };
})(AdminPanelNewTickets);