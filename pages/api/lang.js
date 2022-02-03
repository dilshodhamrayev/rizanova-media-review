import { post } from "../../utils/request";
import withSession from "../../utils/session";

export default withSession(async (req, res) => {
    const data = await req.body;

    if (_res.status == 'success') {
        try {
            req.session.set('lang', data.lang);

            let s = await req.session.save();

        } catch (error) {
            const { response: fetchResponse } = error;
            res.status(fetchResponse?.status || 500).json(error.data);
        }
    }
    res.json(_res);
    return;
});