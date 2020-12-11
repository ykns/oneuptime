import uuid from 'uuid';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { FormLoader } from '../basic/Loader';
import ShouldRender from '../basic/ShouldRender';
import { openModal, closeModal } from '../../actions/modal';
import DisableMonitor from '../modals/DisableMonitor';
import { disableMonitor } from '../../actions/monitor';
import { history } from '../../store';
import DataPathHoC from '../DataPathHoC';
import { logEvent } from '../../analytics';
import { SHOULD_LOG_ANALYTICS } from '../../config';

export class MonitorViewDisableBox extends Component {
    constructor(props) {
        super(props);
        this.state = { disableModalId: uuid.v4() };
    }

    disableMonitor = () => {
        const projectId =
            this.props.monitor.projectId._id || this.props.monitor.projectId;
        const promise = this.props.disableMonitor(
            this.props.monitor._id,
            projectId
        );
        history.push(
            `/dashboard/project/${this.props.currentProject._id}/${this.props.componentId}/monitoring`
        );
        if (SHOULD_LOG_ANALYTICS) {
            logEvent(
                'EVENT: DASHBOARD > PROJECT > COMPONENT > MONITOR > MONITOR DISABLED',
                {
                    ProjectId: this.props.currentProject._id,
                    monitorId: this.props.monitor._id,
                }
            );
        }
        return promise;
    };

    handleKeyBoard = e => {
        switch (e.key) {
            case 'Escape':
                return this.props.closeModal({ id: this.state.disableModalId });
            default:
                return false;
        }
    };

    render() {
        let disabling = false;
        if (
            this.props.monitorState &&
            this.props.monitorState.disableMonitor &&
            this.props.monitorState.disableMonitor === this.props.monitor._id
        ) {
            disabling = true;
        }
        const { disableModalId } = this.state;
        const disabledMonitor =
            this.props.monitor && this.props.monitor.disabled;
        return (
            <div
                onKeyDown={this.handleKeyBoard}
                className="Box-root Margin-bottom--12"
            >
                <div className="bs-ContentSection Card-root Card-shadow--medium">
                    <div className="Box-root">
                        <div className="bs-ContentSection-content Box-root Box-divider--surface-bottom-1 Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--16">
                            <div className="Box-root">
                                <span className="Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                    <span>Disable Monitor</span>
                                </span>
                                <p>
                                    <span>
                                        Click the button to disable this
                                        monitor.
                                    </span>
                                </p>
                            </div>
                            <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--0 Padding-vertical--12">
                                <span className="db-SettingsForm-footerMessage"></span>
                                <div>
                                    <button
                                        className="bs-Button bs-DeprecatedButton bs-Button--grey"
                                        disabled={disabling}
                                        id={`disable_${this.props.monitor.name}`}
                                        onClick={() =>
                                            this.props.openModal({
                                                id: disableModalId,
                                                onClose: () => '',
                                                onConfirm: () =>
                                                    this.disableMonitor(),
                                                content: DataPathHoC(
                                                    DisableMonitor,
                                                    {
                                                        monitor: this.props
                                                            .monitor,
                                                    }
                                                ),
                                            })
                                        }
                                    >
                                        <ShouldRender if={!disabling}>
                                            <span>
                                                {disabledMonitor
                                                    ? 'Enable'
                                                    : 'Disable'}
                                            </span>
                                        </ShouldRender>
                                        <ShouldRender if={disabling}>
                                            <FormLoader />
                                        </ShouldRender>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

MonitorViewDisableBox.displayName = 'MonitorViewDisableBox';

const mapDispatchToProps = dispatch =>
    bindActionCreators({ openModal, closeModal, disableMonitor }, dispatch);

const mapStateToProps = state => {
    return {
        monitorState: state.monitor,
        currentProject: state.project.currentProject,
    };
};

MonitorViewDisableBox.propTypes = {
    currentProject: PropTypes.object.isRequired,
    componentId: PropTypes.string.isRequired,
    closeModal: PropTypes.func,
    openModal: PropTypes.func.isRequired,
    monitorState: PropTypes.object.isRequired,
    monitor: PropTypes.object.isRequired,
    disableMonitor: PropTypes.func.isRequired,
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(MonitorViewDisableBox)
);
