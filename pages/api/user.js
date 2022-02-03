import { get } from "../../utils/request";
import withSession from "../../utils/session"

export default withSession(async (req, res) => {
    const user = req.session.get('user');

    try {
        let params = {};

        if (user) {
            params = {
                "headers": {
                    "Authorization": "Bearer " + user.token
                }
            };

            let r = await get("account/user", params);

            if (r)
                res.json(r);
            else
                res.json(null);
        } else {
            res.json(null);
        }
    } catch (ex) {
        res.json(null);
    }
})