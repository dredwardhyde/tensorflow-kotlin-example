import React from "react";
import ReactDOM from "react-dom";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {Provider} from "react-redux";
import thunkMiddleware from "redux-thunk";
import {Route, Switch} from "react-router";
import {HashRouter} from "react-router-dom";
import {routerReducer} from "react-router-redux";
import ObjectDetectionForm from "./Pages/ObjectDetectionForm";

const reducer = combineReducers({routing: routerReducer});
const store = createStore(
    reducer,
    compose(
        applyMiddleware(thunkMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
);

export default class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <HashRouter>
                    <Route path="/">
                        <div>
                            <Switch>
                                <Route path="/" component={ObjectDetectionForm}/>
                            </Switch>
                        </div>
                    </Route>
                </HashRouter>
            </Provider>
        );
    }
}

ReactDOM.render(<Index/>, document.getElementById("application"));
