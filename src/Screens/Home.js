import React, { Fragment } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { withMenuBar } from '../Hocs/withMenuBar';
import { Container, Image } from 'react-bootstrap';
import wallpaper from '../img/wallscq.jpg'
class Home extends React.Component {






    render() {

        return (
            <Fragment>
                    <Image fluid src={wallpaper} ></Image>
            </Fragment>

        )




    }

}

export default withRouter(withMenuBar(Home))