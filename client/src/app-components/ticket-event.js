import React from 'react';
import classNames from 'classnames';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import DateTransformer from 'lib-core/date-transformer';
import Icon from 'core-components/icon';
import Tooltip from 'core-components/tooltip';

class TicketEvent extends React.Component {
    static propTypes = {
        type: React.PropTypes.oneOf([
            'COMMENT',
            'ASSIGN',
            'UN_ASSIGN',
            'CLOSE',
            'RE_OPEN',
            'DEPARTMENT_CHANGED',
            'PRIORITY_CHANGED'
        ]),
        author: React.PropTypes.object,
        content: React.PropTypes.string,
        date: React.PropTypes.string,
        private: React.PropTypes.string,
    };

    render() {
        let iconNode = null;

        if (this.props.type === 'COMMENT' && this.props.author && this.props.author.staff) {
            iconNode = this.renderStaffPic();
        } else {
            iconNode = this.renderIcon();
        }

        return (
            <div className={this.getClass()}>
                <span className="ticket-event__connector" />
                <div className="col-md-1">
                    {iconNode}
                </div>
                <div className="col-md-11">
                    {this.renderEventDescription()}
                </div>
            </div>
        );
    }

    renderStaffPic() {
        let profilePicName = this.props.author.profilePic;

        return (
            <div className="ticket-event__staff-pic">
                <img src={(profilePicName) ? API.getFileLink(profilePicName) : (API.getURL() + '/images/profile.png')} className="ticket-event__staff-pic-img" />
            </div>
        );
    }

    renderIcon() {
        return (
            <div className="ticket-event__icon">
                <Icon {...this.getIconProps()}/>
            </div>
        );
    }

    renderEventDescription() {
        const renders = {
            'COMMENT': this.renderComment.bind(this),
            'ASSIGN': this.renderAssignment.bind(this),
            'UN_ASSIGN': this.renderUnAssignment.bind(this),
            'CLOSE': this.renderClosed.bind(this),
            'RE_OPEN': this.renderReOpened.bind(this),
            'DEPARTMENT_CHANGED': this.renderDepartmentChange.bind(this),
            'PRIORITY_CHANGED': this.renderPriorityChange.bind(this)
        };

        return renders[this.props.type]();
    }

    renderComment() {
        return (
            <div className="ticket-event__comment">
                <span className="ticket-event__comment-pointer" />
                <div className="ticket-event__comment-author">
                    <span className="ticket-event__comment-author-name">{this.props.author.name}</span>
                    <span className="ticket-event__comment-badge-container">
                        <span className="ticket-event__comment-badge">{i18n((this.props.author.staff) ? 'STAFF' : 'CUSTOMER')}</span>
                    </span>
                    {this.props.author.customfields.map(this.renderCustomFieldValue.bind(this))}
                    {(this.props.private*1) ? this.renderPrivateBadge() : null}
                </div>
                <div className="ticket-event__comment-date">{DateTransformer.transformToString(this.props.date)}</div>
                <div className="ticket-event__comment-content" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                {this.renderFileRow(this.props.file)}
            </div>
        );
    }

    renderAssignment() {
        let assignedTo = this.props.content;
        let authorName = this.props.author.name;

        if(!assignedTo || assignedTo == authorName) {
            assignedTo = i18n('HIMSELF');
        }

        return (
            <div className="ticket-event__circled">
                <span className="ticket-event__circled-author">{authorName}</span>
                <span className="ticket-event__circled-text"> {i18n('ACTIVITY_ASSIGN_THIS')}</span>
                <span className="ticket-event__circled-text"> {assignedTo}</span>
                <span className="ticket-event__circled-date"> {i18n('DATE_PREFIX')} {DateTransformer.transformToString(this.props.date)}</span>
            </div>
        )
    }

    renderUnAssignment() {
        let unAssignedTo = this.props.content;
        let authorName = this.props.author.name;

        if(!unAssignedTo || unAssignedTo == authorName) {
            unAssignedTo = i18n('HIMSELF');
        }

        return (
            <div className="ticket-event__circled">
                <span className="ticket-event__circled-author">{authorName}</span>
                <span className="ticket-event__circled-text"> {i18n('ACTIVITY_UN_ASSIGN_THIS')}</span>
                <span className="ticket-event__circled-text"> {unAssignedTo}</span>
                <span className="ticket-event__circled-date"> {i18n('DATE_PREFIX')} {DateTransformer.transformToString(this.props.date)}</span>
            </div>
        )
    }

    renderClosed() {
        return (
            <div className="ticket-event__circled">
                <span className="ticket-event__circled-author">{this.props.author.name}</span>
                <span className="ticket-event__circled-text"> {i18n('ACTIVITY_CLOSE_THIS')}</span>
                <span className="ticket-event__circled-date"> {i18n('DATE_PREFIX')} {DateTransformer.transformToString(this.props.date)}</span>
            </div>
        )
    }

    renderReOpened() {
        return (
            <div className="ticket-event__circled">
                <span className="ticket-event__circled-author">{this.props.author.name}</span>
                <span className="ticket-event__circled-text"> {i18n('ACTIVITY_RE_OPEN_THIS')}</span>
                <span className="ticket-event__circled-date"> {i18n('DATE_PREFIX')} {DateTransformer.transformToString(this.props.date)}</span>
            </div>
        );
    }

    renderDepartmentChange() {
        return (
            <div className="ticket-event__circled">
                <span className="ticket-event__circled-author">{this.props.author.name}</span>
                <span className="ticket-event__circled-text"> {i18n('ACTIVITY_DEPARTMENT_CHANGED_THIS')}</span>
                <span className="ticket-event__circled-indication"> {this.props.content}</span>
                <span className="ticket-event__circled-date"> {i18n('DATE_PREFIX')} {DateTransformer.transformToString(this.props.date)}</span>
            </div>
        );
    }

    renderPriorityChange() {
        return (
            <div className="ticket-event__circled">
                <span className="ticket-event__circled-author">{this.props.author.name}</span>
                <span className="ticket-event__circled-text"> {i18n('ACTIVITY_PRIORITY_CHANGED_THIS')}</span>
                <span className="ticket-event__circled-indication"> {this.props.content}</span>
                <span className="ticket-event__circled-date"> {i18n('DATE_PREFIX')} {DateTransformer.transformToString(this.props.date)}</span>
            </div>
        );
    }

    renderPrivateBadge() {
        return (
            <span className="ticket-event__comment-badge-container">
                <Tooltip content={i18n('PRIVATE_RESPONSE_DESCRIPTION')} openOnHover>
                    <span className="ticket-event__comment-badge">{i18n('PRIVATE')}</span>
                </Tooltip>
            </span>
        );
    }

    renderFileRow(file) {
        let node = null;

        if (file) {
            node = <span> {this.getFileLink(file)} <Icon name="paperclip" /> </span>;
        } else {
            node = i18n('NO_ATTACHMENT');
        }

        return (
            <div className="ticket-event__file">
                {node}
            </div>
        );
    }

    renderCustomFieldValue(customField) {
        return (
            <span className="ticket-event__comment-badge-container">
                <span className="ticket-event__comment-badge">
                    {customField.customfield}: <span className="ticket-event__comment-badge-value">{customField.value}</span>
                </span>
            </span>
        );
    }

    getClass() {
        const circledTypes = {
            'COMMENT': false,
            'ASSIGN': true,
            'UN_ASSIGN': true,
            'CLOSE': true,
            'RE_OPEN': true,
            'DEPARTMENT_CHANGED': true,
            'PRIORITY_CHANGED': true
        };
        const classes = {
            'row': true,
            'ticket-event': true,
            'ticket-event_staff': this.props.author && this.props.author.staff,
            'ticket-event_circled': circledTypes[this.props.type],
            'ticket-event_unassignment': this.props.type === 'UN_ASSIGN',
            'ticket-event_close': this.props.type === 'CLOSE',
            'ticket-event_reopen': this.props.type === 'RE_OPEN',
            'ticket-event_department': this.props.type === 'DEPARTMENT_CHANGED',
            'ticket-event_priority': this.props.type === 'PRIORITY_CHANGED',
            'ticket-event_private': this.props.private*1,
        };

        return classNames(classes);
    }

    getIconProps() {
        const iconName = {
            'COMMENT': 'comment-o',
            'ASSIGN': 'user',
            'UN_ASSIGN': 'user-times',
            'CLOSE': 'lock',
            'RE_OPEN': 'unlock-alt',
            'DEPARTMENT_CHANGED': 'exchange',
            'PRIORITY_CHANGED': 'exclamation'
        };
        const iconSize = {
            'COMMENT': '2x',
            'ASSIGN': 'lg',
            'UN_ASSIGN': 'lg',
            'CLOSE': 'lg',
            'RE_OPEN': 'lg',
            'DEPARTMENT_CHANGED': 'lg',
            'PRIORITY_CHANGED': 'lg'
        };

        return {
            name: iconName[this.props.type],
            size: iconSize[this.props.type]
        }
    }

    getFileLink(filePath = '') {
        const fileName = filePath.replace(/^.*[\\\/]/, '');

        return (
            <a href={API.getFileLink(filePath)}>{fileName}</a>
        )
    }
}

export default TicketEvent;
