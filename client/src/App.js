import {Navigation} from "./components/Navigation/Navigation";
import {Header} from "./components/Header/Header";
import {useState} from "react";
import {UserContextProvider} from "./context/userContext";
import {ACCOUNT, HISTORY, HOME, SUBSCRIPTIONS, VIDEOS} from "./consts/pages";
import {PageView} from "./components/PageView/PageView";
import {Page} from "./components/Page/Page";

export const App = () => {
    const [activePage, setActivePage] = useState(HOME)

    return (
        <UserContextProvider>
            <Header
                activePage={activePage}
                onPageSelect={page => setActivePage(page)}
            />
            <Navigation
                activePage={activePage}
                onPageSelect={page => setActivePage(page)}
            />
            <PageView activePage={activePage}>
                <Page id={HOME} title="Главная">
                    <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid asperiores at atque
                        cupiditate dicta distinctio dolorem, ducimus fugiat harum incidunt laborum nesciunt odio odit
                        quo soluta totam, ut voluptates.
                    </div>
                    <div>Animi aperiam assumenda autem, cupiditate doloribus et excepturi ipsam iusto magni maxime
                        molestias, nesciunt obcaecati placeat quasi qui, sint soluta temporibus? Aliquam beatae delectus
                        eligendi fuga harum nobis reiciendis veniam.
                    </div>
                    <div>Ad autem beatae dolor eaque et ex facere impedit inventore ipsam magnam maiores maxime
                        molestias mollitia non optio perspiciatis placeat recusandae repudiandae tenetur, voluptates.
                        Animi debitis error quis! Alias, animi!
                    </div>
                    <div>Commodi culpa dolores molestias nesciunt quasi reiciendis repellat veniam? Aperiam at autem
                        consequuntur culpa dolore ea eius error expedita laboriosam maxime nobis non nostrum quaerat
                        quas quisquam, rerum, sequi sit.
                    </div>
                    <div>Doloremque ex ipsum minima omnis perferendis perspiciatis porro quaerat repudiandae! Accusamus
                        beatae, cumque eos eveniet exercitationem possimus! Architecto debitis et neque nihil nobis, non
                        obcaecati, porro possimus, quaerat quam sapiente!
                    </div>
                    <div>Autem deserunt dolore doloribus iste nihil praesentium saepe temporibus, velit! Cumque dolor,
                        earum ex facere fugit harum laboriosam non odio officiis perferendis provident quidem saepe
                        suscipit, temporibus vel. Perferendis, quae?
                    </div>
                    <div>A commodi explicabo hic nobis possimus quia quibusdam recusandae voluptatibus. Ab amet atque
                        deleniti dicta dolorem explicabo laborum maiores, maxime obcaecati officiis possimus praesentium
                        quia quisquam recusandae unde ut veniam.
                    </div>
                    <div>Alias est impedit itaque laudantium nobis! Beatae, dolores eum! Aspernatur corporis dolorum
                        eveniet hic numquam perspiciatis quidem reiciendis veritatis? Aperiam deserunt, ipsam iste
                        molestiae nesciunt repudiandae! Aperiam odit sapiente vitae.
                    </div>
                    <div>Alias aspernatur consequatur corporis, deserunt dolor ea laudantium molestiae nobis, numquam
                        officia pariatur, perferendis possimus rem repellendus repudiandae temporibus ut? Accusantium at
                        doloremque enim exercitationem facere magni nisi repellat voluptas!
                    </div>
                    <div>Ab accusamus adipisci aperiam at cupiditate, debitis dicta doloremque earum et eum mollitia
                        nemo numquam omnis quo quos saepe similique soluta tempore? Dolore ea enim laborum nihil ullam.
                        Soluta, voluptatibus.
                    </div>
                    <div>Ab ea eius eveniet, id iste perspiciatis rerum veritatis. Aliquam, assumenda aut dolores eaque
                        earum est eveniet excepturi expedita facere harum, nobis nostrum, odio perspiciatis quaerat
                        quasi rem repellendus voluptatibus?
                    </div>
                    <div>A facere necessitatibus officia placeat sequi voluptas. Ab alias consequatur deserunt
                        distinctio dolore, ducimus earum eligendi enim eveniet impedit, incidunt mollitia quos
                        recusandae similique sint soluta suscipit ullam vel voluptas.
                    </div>
                    <div>Alias autem beatae dolor eligendi et eum natus nesciunt porro, praesentium recusandae. Hic,
                        quibusdam, unde. Consequatur consequuntur dolorem eos est eveniet mollitia nam qui quia vero
                        voluptate? Blanditiis, magnam, nemo?
                    </div>
                    <div>Alias architecto atque autem cumque dicta dolorem, enim neque qui vel velit. Cupiditate
                        deleniti doloremque explicabo facilis hic iure libero magnam magni minima nemo, nihil nostrum
                        officiis quae quas rem?
                    </div>
                    <div>A ab, accusamus animi atque commodi dolores ducimus explicabo fugit in inventore ipsum labore
                        laborum minima repudiandae saepe similique soluta tempora tempore veniam voluptate! Amet cum
                        laborum quod totam ut.
                    </div>
                    <div>Beatae, cumque dicta dolore error et facere facilis, magnam mollitia necessitatibus nihil nisi
                        pariatur quisquam reiciendis repellendus sint, tenetur veniam veritatis! Asperiores at corporis
                        doloribus, dolorum in omnis porro quod?
                    </div>
                    <div>Aut dignissimos laborum repudiandae. Ad ex exercitationem illum ipsa molestiae, nesciunt
                        possimus rerum veniam. Doloremque ex nemo odio omnis pariatur possimus quia rem veniam voluptas.
                        Itaque libero magnam possimus veritatis?
                    </div>
                    <div>Asperiores cumque dolore et fugiat in labore recusandae sit totam ullam voluptate! Alias beatae
                        blanditiis dicta dolor doloribus exercitationem fugiat fugit laudantium libero nisi porro qui
                        quis sed, ullam vero?
                    </div>
                    <div>Aliquid amet asperiores aspernatur consequuntur delectus dicta, exercitationem fugit hic illum
                        ipsa mollitia neque nihil nobis nostrum odio odit pariatur provident quae quis quo reprehenderit
                        sint, sit unde vel voluptate?
                    </div>
                    <div>At deleniti doloremque dolores eos est, facilis magni molestiae, nostrum officiis optio
                        quibusdam, reiciendis similique unde voluptatem voluptatibus. Accusantium alias at aut autem
                        distinctio ipsum magnam odit quis quos repellat!
                    </div>
                </Page>
                <Page id={SUBSCRIPTIONS} title="Подписки"></Page>
                <Page id={HISTORY} title="История"></Page>
                <Page id={VIDEOS} title="Ваши видео"></Page>
                <Page id={ACCOUNT} title="Аккаунт"></Page>
            </PageView>
        </UserContextProvider>
    )
}