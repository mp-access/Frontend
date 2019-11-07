import { Clock } from 'react-feather';
import Util from '../utils/Util';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const FromToDateTimeLabel = ({ fromDateTime, toDateTime, fromAppend = false, toAppend = false, ...props }) => (
    <small {...props}>
        <Clock size={12}/> Open
        from: <strong>{Util.dateTimeFormatter(fromDateTime, fromAppend)}</strong> -
        to: <strong>{Util.dateTimeFormatter(toDateTime, toAppend)}</strong>
    </small>
);

const FromToDateTime = ({ fromDateTime, toDateTime, fromAppend = false, toAppend = false }) => {
    const isSameTZ = Util.isClientAndServerTZEquals();

    if (!isSameTZ) {
        const fromDateInServerLocalDateTime = Util.dateTimeInServerLocalTime(fromDateTime, false);
        const toDateInServerLocalDateTime = Util.dateTimeInServerLocalTime(toDateTime, true);
        return <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip id={'dateTimeTooltip'}>
                    {fromDateInServerLocalDateTime + ' to ' + toDateInServerLocalDateTime}
                </Tooltip>
            }
        >
            <FromToDateTimeLabel fromDateTime={fromDateTime} toDateTime={toDateTime} fromAppend={fromAppend}
                                 toAppend={toAppend}/>
        </OverlayTrigger>;

    }
    return <FromToDateTimeLabel fromDateTime={fromDateTime} toDateTime={toDateTime} fromAppend={false}
                                toAppend={false}/>;
};

const DueDateTime = ({ dueDate }) => {
    const isSameTZ = Util.isClientAndServerTZEquals();
    const dueDateLabel = <small><Clock size={12}/> Due date: {Util.dateTimeFormatter(dueDate, !isSameTZ)}</small>;
    if (!isSameTZ) {
        const dueDateInServerLocalTime = Util.dateTimeInServerLocalTime(dueDate, true);
        return (
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="tooltip-outdated">
                        {dueDateInServerLocalTime}
                    </Tooltip>
                }
            >
                {dueDateLabel}
            </OverlayTrigger>
        );
    }

    return dueDateLabel;
};

export { DueDateTime, FromToDateTime };