type SignHeaderProps = {
  title: string;
  description: string;
};

const SignInHeader = (props: SignHeaderProps) => {
  return (
    <div>
      <section className="flex flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold text-center pt-5 md:pt-12">
          {props.title}
        </h2>

        <p className="text-light-3 small-medium text-center my-2">
          {props.description}
        </p>
      </section>
    </div>
  );
};

export default SignInHeader;
