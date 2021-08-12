import React from "react";
import * as url from "../Common/Url";
import {Button, ListGroupItem, ListGroup, Label, Panel} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as ObjectDetectionActions from "./ObjectDetectionActions";
import '../Common/style.css'

class ObjectDetectionForm extends React.Component {

    state = {
        fileToUpload: null,
        detectionStatus: 'idle',
        detectedClasses: []
    };

    getDetectedClasses = () => {
        if (this.state.detectedClasses.length === 0)
            return <div/>
        let items = []
        this.state.detectedClasses.forEach((element) => {
            items.push(<ListGroupItem>
                <Label bsStyle="primary">{element.name}</Label>
                <Label bsStyle="success">{element.score}</Label>
            </ListGroupItem>)
        })
        return <ListGroup>
            {items}
        </ListGroup>
    }

    previewFile = () => {
        const preview = document.querySelector('img');
        const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader();
        reader.onloadend = function () {
            preview.src = reader.result;
        }
        reader.readAsDataURL(file);
    }

    render() {
        return (
            <div>
                <Panel
                    style={{
                        width: "500px",
                        height: "200px",
                        position: "absolute",
                        left: "calc(50% - 250px)",
                        top: "100px",
                    }}
                >
                    <Panel.Heading>
                        <Panel.Title>Object Detection</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <img src={"./tf_test_image.jpeg"} height="100%" width="100%" alt="Image preview..."/>
                        <div>
                            <form method="post"
                                  action={url.DETECT_OBJECTS}
                                  target="dummyframe"
                                  encType="multipart/form-data">
                                <input
                                    type="file"
                                    className={"form-control form-control-lg"}
                                    id="fileUploaderInput"
                                    name="upload"
                                    onChange={() => {
                                        let files = document.querySelector("#fileUploaderInput").files
                                        if (files.length === 1) {
                                            this.setState({fileToUpload: files[0], detectedClasses: []})
                                            this.previewFile()
                                        } else
                                            this.setState({fileToUpload: null, detectedClasses: []})
                                    }}
                                    accept={["png", "jpeg", "jpg"]}/>
                            </form>
                        </div>
                        <Button id="detection_btn" bsStyle="primary"
                                onClick={() => {
                                    if (this.state.fileToUpload == null) return
                                    this.setState({detectionStatus: 'in_progress'});
                                    this.props.detectObjects(this.state.fileToUpload, (detectedClasses) => {
                                        this.setState({
                                            detectionStatus: 'idle',
                                            detectedClasses: JSON.parse(detectedClasses)
                                        });
                                    })
                                }}>
                            {this.state.detectionStatus === 'idle' ? 'Detect objects' : 'Detection in progress...'}
                        </Button>
                        <div>
                            {this.getDetectedClasses()}
                        </div>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

export default connect(
    () => ({}),
    dispatch => ({
        detectObjects: bindActionCreators(ObjectDetectionActions.detectObjects, dispatch)
    })
)(ObjectDetectionForm)