import React, {useMemo} from "react";
import {Form} from "react-bulma-components";
import {useId} from "react-use-id-hook";
import {useDispatch, useSelector} from "react-redux";
import {RootState, RootStore} from "../data/redux/store";
import {setDataVersion} from "../data/redux/version";

export const MinecraftVersionSelector: React.FC = () => {
    const dispatch: RootStore['dispatch'] = useDispatch();

    const availableVersions = useSelector((state: RootState) => state.version.available);
    const sortedVersions = useMemo(
        () => {
            const copy = [...availableVersions];
            // Sort biggest to smallest
            copy.sort((a, b) => b.dataVersion - a.dataVersion);
            return copy;
        },
        [availableVersions]
    );
    const currentVersion = useSelector((state: RootState) => state.version.data);

    const labelId = "label-" + useId();
    return <>
        <label className="mx-3" id={labelId}>Minecraft Version</label>
        <Form.Select value={currentVersion}
                     onChange={e => void dispatch(setDataVersion(parseInt(e.currentTarget.value)))}
                     aria-labelledby={labelId}>
            {sortedVersions.map(v =>
                <option key={v.dataVersion} value={v.dataVersion}>
                    {v.version} ({v.dataVersion})
                </option>
            )}
        </Form.Select>
    </>;
};
