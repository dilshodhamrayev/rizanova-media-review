import { post } from "../../utils/request";
import withSession from "../../utils/session";

export default withSession(async (req, res) => {
    const data = await req.body;

    let _res = await post('user/social', data);

    if (_res.status == 'success') {
        try {
            const user = _res.user;

            req.session.set('user', user);

            let s = await req.session.save();

        } catch (error) {
            const { response: fetchResponse } = error;
            res.status(fetchResponse?.status || 500).json(error.data);
        }
    }

    res.json(_res);

    return;
});