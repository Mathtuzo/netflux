import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="container mt-5" role="main" aria-label="Page des offres et FAQ">
      <h2 className="py-5" tabIndex="0">Pricing</h2>
      <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm">
            <div className="card-header py-3 text-bg-primary border-primary">
              <h4 className="my-0 fw-normal">Standard avec pub</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                4,99€<small className="text-body-secondary fw-light">/mo</small>
              </h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>10 users included</li>
                <li>2 GB of storage</li>
                <li>Email support</li>
                <li>Help center access</li>
              </ul>
              <button
                type="button"
                className="w-100 btn btn-lg btn-primary"
                onClick={handleRegisterClick}
                aria-label="Choisir l'offre Standard avec pub"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm border-primary">
            <div className="card-header py-3 text-bg-primary border-primary">
              <h4 className="my-0 fw-normal">Standard</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                14,99€
                <small className="text-body-secondary fw-light">/mo</small>
              </h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>20 users included</li>
                <li>10 GB of storage</li>
                <li>Priority email support</li>
                <li>Help center access</li>
              </ul>
              <button 
                type="button" 
                className="w-100 btn btn-lg btn-primary"
                onClick={handleRegisterClick}
                aria-label="Choisir l'offre Standard"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm ">
            <div className="card-header py-3 text-bg-primary border-primary">
              <h4 className="my-0 fw-normal">Premium</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                19,99€
                <small className="text-body-secondary fw-light">/mo</small>
              </h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>30 users included</li>
                <li>15 GB of storage</li>
                <li>Phone and email support</li>
                <li>Help center access</li>
              </ul>
              <button 
                type="button" 
                className="w-100 btn btn-lg btn-primary"
                onClick={handleRegisterClick}
                aria-label="Choisir l'offre Premium"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="py-5" tabIndex="0">Foire aux questions</h2>
      <div className="accordion" id="accordionExample" role="region" aria-label="Foire aux questions">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Qu'est-ce que cette application ?
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              Cette application est une plateforme de streaming vidéo .
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Combien ça coute ?
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              Utilisez notre appli sur votre smartphone, tablette, Smart TV,
              ordinateur ou appareil de streaming, le tout pour un tarif mensuel
              fixe. Les offres vont de 4,99 € à 19,99 € par mois
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Comment annuler mon abonnement ?
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              Cette appli offre une grande souplesse. Pas de contrat compliqué.
              Sans engagement. Deux clics suffisent pour annuler votre compte en
              ligne. Pas de frais d'annulation : ouvrez ou fermez votre compte à
              tout moment
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingFour">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              Que puis-je regarder ?
            </button>
          </h2>
          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            aria-labelledby="headingFour"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              Cette appli propose un vaste catalogue comprenant notamment des
              longs-métrages, des documentaires, des séries, des animes et des
              programmes originaux .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}